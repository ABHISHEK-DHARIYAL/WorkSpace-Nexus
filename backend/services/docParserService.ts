import mammoth from "mammoth";
import { PageService } from "./pageService";
import { ListingService } from "./listingService";
import { JSDOM } from "jsdom";
import * as PDFParseModule from "pdf-parse";

// Defensive check for PDFParse constructor
const getPDFParse = () => {
  if (PDFParseModule.PDFParse) return PDFParseModule.PDFParse;
  // @ts-ignore
  if (PDFParseModule.default?.PDFParse) return PDFParseModule.default.PDFParse;
  // @ts-ignore
  if (typeof PDFParseModule.default === 'function') return PDFParseModule.default;
  // @ts-ignore
  if (typeof PDFParseModule === 'function') return PDFParseModule;
  return null;
};

export interface ParsedDoc {
  title: string;
  pages: Array<{
    title: string;
    content: string;
    pageNumber: number;
  }>;
  index: Array<{
    title: string;
    pageNumber: number;
    level: number;
    anchorId: string;
  }>;
}

export class DocParserService {
  /**
   * Main entry point for document parsing
   */
  static async parse(buffer: Buffer, originalName: string, mimetype: string, ownerEmail: string): Promise<any> {
    if (mimetype === "application/pdf") {
      return this.parsePdf(buffer, originalName, ownerEmail);
    } else {
      return this.parseDocx(buffer, originalName, ownerEmail);
    }
  }

  /**
   * Parses a PDF buffer and returns structured data
   */
  static async parsePdf(buffer: Buffer, originalName: string, ownerEmail: string): Promise<any> {
    const PDFParseClass = getPDFParse();
    if (!PDFParseClass) {
      throw new Error("PDF parser not properly initialized. This may be an environment issue.");
    }

    try {
      // Check if it's the class-based one or the function-based one
      let pages = [];
      
      if (PDFParseClass.prototype && PDFParseClass.prototype.getText) {
        // @ts-ignore
        const parser = new PDFParseClass({ data: buffer });
        const textResult = await parser.getText();
        
        pages = textResult.pages.map((p: any) => ({
          title: p.num === 1 ? "Introduction" : `Page ${p.num}`,
          content: p.text.split('\n').map((line: string) => `<p>${line}</p>`).join(''),
          pageNumber: p.num
        }));
      } else {
        // Traditional function-based pdf-parse
        // @ts-ignore
        const data = await PDFParseClass(buffer);
        const text = data.text;
        const chunks = text.match(/[\s\S]{1,2500}/g) || [text];
        pages = chunks.map((chunk: string, idx: number) => ({
          title: idx === 0 ? "Introduction" : `Page ${idx + 1}`,
          content: chunk.split('\n').map((p: string) => `<p>${p}</p>`).join(''),
          pageNumber: idx + 1
        }));
      }

      const index = pages.map((p: any, idx: number) => ({
        title: p.title,
        pageNumber: p.pageNumber,
        level: 1,
        anchorId: `page-${idx}`
      }));

      // Create the Listing
      const listingTitle = originalName.replace(/\.[^/.]+$/, "");
      const listing = await ListingService.create({
        title: listingTitle,
        description: `Imported from ${originalName} (PDF)`
      }, ownerEmail);

      // Create the Pages
      const createdPages = [];
      for (const page of pages) {
        const createdPage = await PageService.create({
          listingId: listing.id,
          title: page.title,
          content: page.content,
          pageNumber: page.pageNumber
        });
        createdPages.push(createdPage);
      }

      // Update Listing with index and pages
      await ListingService.update(listing.id, {
        pages: createdPages.map(p => p.id),
        index: index.map((item: any) => ({
          ...item,
          pageId: createdPages.find(p => p.pageNumber === item.pageNumber)?.id
        }))
      });

      return {
        listing,
        pages: createdPages
      };
    } catch (parseError: any) {
      console.error("PDF Parsing Internal Error:", parseError);
      throw new Error(`Failed to parse PDF: ${parseError.message}`);
    }
  }

  /**
   * Parses a DOCX buffer and returns structured data
   */
  static async parseDocx(buffer: Buffer, originalName: string, ownerEmail: string): Promise<any> {
    // Generate HTML from DOCX
    const { value: html } = await mammoth.convertToHtml({ buffer });
    
    // Create a DOM to manipulate the HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract structure
    // We'll treat H1/H2 as page breaks or section headers
    // For simplicity, every H1/H2 starts a new "Page" in our system
    // Normal paragraphs and tables go into the current page
    
    const pages: any[] = [];
    let currentPage: any = {
      title: "Introduction",
      content: "",
      pageNumber: 1
    };
    
    const index: any[] = [];
    let pageCounter = 1;
    
    const body = document.body;
    const children = Array.from(body.children);
    
    children.forEach((child, idx) => {
      const tagName = child.tagName.toLowerCase();
      
      // Handle headings for index and page breaks
      if (tagName === 'h1' || tagName === 'h2') {
        // If the current page has content, push it and start a new one
        if (currentPage.content.trim() !== "" || pages.length === 0) {
          if (pages.length > 0 || currentPage.content.trim() !== "") {
            pages.push({ ...currentPage });
            pageCounter++;
            currentPage = {
              title: child.textContent || `Section ${pageCounter}`,
              content: "",
              pageNumber: pageCounter
            };
          } else {
            currentPage.title = child.textContent || "Introduction";
          }
        } else {
          currentPage.title = child.textContent || "Introduction";
        }
        
        // Add to index
        const anchorId = `heading-${idx}`;
        child.id = anchorId;
        index.push({
          title: child.textContent || "Untitled",
          pageNumber: pageCounter,
          level: tagName === 'h1' ? 1 : 2,
          anchorId
        });
      }
      
      // Append to current page content
      // Mammoth produces clean HTML, but we might want to wrap tables in a responsive div
      if (tagName === 'table') {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive my-6 overflow-x-auto';
        const clonedTable = child.cloneNode(true) as HTMLElement;
        clonedTable.classList.add('min-w-full', 'border-collapse');
        wrapper.appendChild(clonedTable);
        currentPage.content += wrapper.outerHTML;
      } else {
        currentPage.content += child.outerHTML;
      }
    });
    
    // Push the last page
    if (currentPage.content.trim() !== "" || pages.length === 0) {
      pages.push(currentPage);
    }
    
    // Create the Listing
    const listingTitle = originalName.replace(/\.[^/.]+$/, "");
    const listing = await ListingService.create({
      title: listingTitle,
      description: `Imported from ${originalName}`
    }, ownerEmail);
    
    // Create the Pages
    const createdPages = [];
    for (const page of pages) {
      const createdPage = await PageService.create({
        listingId: listing.id,
        title: page.title,
        content: page.content,
        pageNumber: page.pageNumber
      });
      createdPages.push(createdPage);
    }
    
    // Update Listing with index and pages
    await ListingService.update(listing.id, {
      pages: createdPages.map(p => p.id),
      index: index.map(item => ({
        ...item,
        pageId: createdPages.find(p => p.pageNumber === item.pageNumber)?.id
      }))
    });
    
    return {
      listing,
      pages: createdPages
    };
  }
}
