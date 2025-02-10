import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative border rounded-lg overflow-hidden">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>

      {numPages > 1 && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((page) => Math.max(page - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPageNumber((page) => Math.min(page + 1, numPages))
            }
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
