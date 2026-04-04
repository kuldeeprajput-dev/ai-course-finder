'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Download, Loader2 } from 'lucide-react';
import { Roadmap } from '@/types';

interface ExportButtonProps {
  roadmap: Roadmap;
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const HEADER_HEIGHT = 20;
const BRUTAL_SHADOW_OFFSET = 3;

const C = {
  orange: [255, 99, 33] as [number, number, number],
  black: [10, 10, 10] as [number, number, number],
  gray: [107, 107, 107] as [number, number, number],
  paper: [245, 240, 232] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
  blue: [37, 99, 235] as [number, number, number],
  green: [22, 163, 74] as [number, number, number],
};

function getResourceColor(type: string): [number, number, number] {
  switch (type.toLowerCase()) {
    case 'video': return C.red;
    case 'article': return C.blue;
    case 'project': return C.green;
    default: return C.orange;
  }
}

export function ExportButton({ roadmap }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!roadmap) return;
    setIsExporting(true);

    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      let yPos = 0;
      let pageCount = 1;

      const drawHeader = (isFirst: boolean, title?: string) => {
        doc.setFillColor(...C.black);
        doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F');

        doc.setTextColor(...C.white);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Free Course Finder', MARGIN, 8);

        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180);
        doc.text('AI-powered learning resource discovery', MARGIN, 14);

        if (!isFirst && title) {
          const shortTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
          doc.setTextColor(...C.white);
          doc.setFontSize(8);
          doc.text(shortTitle, PAGE_WIDTH - MARGIN, 8, { align: 'right' });
          doc.setFontSize(6);
          doc.text(`Page ${pageCount}`, PAGE_WIDTH - MARGIN, 14, { align: 'right' });
        }

        doc.setTextColor(...C.gray);
        doc.setFontSize(6);
        doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), PAGE_WIDTH - MARGIN, 18, { align: 'right' });
      };

      const checkBreak = (needed: number) => {
        if (yPos + needed > PAGE_HEIGHT - 25) {
          doc.addPage();
          pageCount++;
          yPos = HEADER_HEIGHT + 8;
          doc.setFillColor(...C.paper);
          doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
          drawHeader(false, roadmap.title);
          return true;
        }
        return false;
      };

      doc.setFillColor(...C.paper);
      doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
      drawHeader(true);

      yPos = HEADER_HEIGHT + 10;

      doc.setFillColor(...C.orange);
      doc.rect(MARGIN - BRUTAL_SHADOW_OFFSET, yPos - BRUTAL_SHADOW_OFFSET, CONTENT_WIDTH + BRUTAL_SHADOW_OFFSET, 35, 'F');

      doc.setFillColor(...C.black);
      doc.rect(MARGIN, yPos, CONTENT_WIDTH, 35, 'F');

      yPos += 5;
      doc.setTextColor(255, 180, 150);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('LEARNING ROADMAP', MARGIN + 4, yPos);
      yPos += 6;

      doc.setTextColor(...C.white);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(roadmap.title, CONTENT_WIDTH - 8);
      doc.text(titleLines, MARGIN + 4, yPos);
      yPos += titleLines.length * 5 + 3;

      doc.setTextColor(255, 255, 255, 0.8);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(roadmap.description, CONTENT_WIDTH - 8);
      doc.text(descLines, MARGIN + 4, yPos);
      yPos += descLines.length * 3.5 + 4;

      doc.setFillColor(...C.white);
      doc.setTextColor(...C.orange);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.roundedRect(MARGIN + 4, yPos, 50, 6, 1, 1, 'F');
      doc.setTextColor(...C.white);
      doc.text(`Duration: ${roadmap.totalDuration}`, MARGIN + 6, yPos + 4);

      yPos = HEADER_HEIGHT + 10 + 42;

      doc.setDrawColor(...C.black);
      doc.setLineWidth(0.4);
      doc.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
      yPos += 8;

      doc.setTextColor(...C.black);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('LEARNING PATH', MARGIN, yPos);
      yPos += 8;

      let prevBoxBottom = 0;

      roadmap.steps.forEach((step, idx) => {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const stepTitleLines = doc.splitTextToSize(step.title, CONTENT_WIDTH - 18);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const stepDescLines = doc.splitTextToSize(step.description, CONTENT_WIDTH - 18);

        const titleHeight = stepTitleLines.length * 4.5;
        const descHeight = stepDescLines.length * 3.5;
        const resourcesStart = 12 + Math.max(titleHeight, 14) + 4 + descHeight + 6;

        let resourcesHeight = 0;
        if (step.resources.length > 0) {
          resourcesHeight += 5;
          step.resources.forEach(res => {
            doc.setFontSize(8);
            const resTitleLines = doc.splitTextToSize(res.title, CONTENT_WIDTH - 70);
            doc.setFontSize(6);
            const urlLines = doc.splitTextToSize(res.url, CONTENT_WIDTH - 70);
            resourcesHeight += Math.max(resTitleLines.length * 4, 8) + urlLines.length * 3 + 4;
          });
        }

        const boxHeight = resourcesStart + resourcesHeight + 8;

        checkBreak(boxHeight + 20);

        doc.setFillColor(...C.black);
        doc.rect(MARGIN - BRUTAL_SHADOW_OFFSET, yPos - BRUTAL_SHADOW_OFFSET, CONTENT_WIDTH + BRUTAL_SHADOW_OFFSET, boxHeight + BRUTAL_SHADOW_OFFSET, 'F');

        doc.setFillColor(...C.white);
        doc.setDrawColor(...C.black);
        doc.setLineWidth(0.5);
        doc.rect(MARGIN, yPos, CONTENT_WIDTH, boxHeight, 'FD');

        if (idx > 0 && prevBoxBottom > 0) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.8);
          const lineX = MARGIN + 5;
          for (let i = 0; i < 4; i++) {
            const dotY = prevBoxBottom + 3 + i * 3;
            if (dotY < yPos - 3) {
              doc.setFillColor(...C.orange);
              doc.circle(lineX, dotY, 1.2, 'F');
            }
          }
        }

        doc.setFillColor(...C.orange);
        doc.circle(MARGIN + 6, yPos + 7, 5, 'F');

        doc.setTextColor(...C.white);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(String(step.step), MARGIN + 6, yPos + 8.5, { align: 'center' });

        let contentY = yPos + 7;
        doc.setTextColor(...C.black);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(stepTitleLines, MARGIN + 14, contentY);
        contentY += titleHeight + 4;

        doc.setTextColor(...C.gray);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(stepDescLines, MARGIN + 14, contentY);
        contentY += descHeight + 6;

        if (step.resources.length > 0) {
          doc.setDrawColor(...C.gray);
          doc.setLineWidth(0.3);
          doc.line(MARGIN + 4, contentY, PAGE_WIDTH - MARGIN - 4, contentY);
          contentY += 5;

          doc.setTextColor(...C.black);
          doc.setFontSize(6);
          doc.setFont('helvetica', 'bold');
          doc.text('RESOURCES', MARGIN + 14, contentY);
          contentY += 5;

          step.resources.forEach(res => {
            const resColor = getResourceColor(res.type);

            doc.setFillColor(...resColor);
            doc.roundedRect(MARGIN + 14, contentY - 3, 16, 5, 0.5, 0.5, 'F');
            doc.setTextColor(...C.white);
            doc.setFontSize(5);
            doc.setFont('helvetica', 'bold');
            doc.text(res.type.toUpperCase(), MARGIN + 15, contentY);

            doc.setTextColor(...C.black);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            const resTitleLines = doc.splitTextToSize(res.title, CONTENT_WIDTH - 90);
            doc.text(resTitleLines, MARGIN + 33, contentY);
            contentY += Math.max(resTitleLines.length * 4, 7);

            doc.setTextColor(...C.blue);
            doc.setFontSize(6);
            const urlLines = doc.splitTextToSize(res.url, CONTENT_WIDTH - 90);
            doc.text(urlLines, MARGIN + 33, contentY);
            contentY += urlLines.length * 3 + 3;
          });
        }

        prevBoxBottom = yPos + boxHeight;
        yPos += boxHeight + 12;
      });

      const footerY = PAGE_HEIGHT - 15;
      doc.setDrawColor(...C.black);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, footerY - 5, PAGE_WIDTH - MARGIN, footerY - 5);

      doc.setTextColor(...C.gray);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by Free Course Finder', MARGIN, footerY);
      doc.text(new Date().toLocaleDateString(), PAGE_WIDTH - MARGIN, footerY, { align: 'right' });

      doc.save(`${roadmap.topic.replace(/[^a-z0-9]/gi, '_')}_roadmap.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="secondary"
      className={cn('gap-2', isExporting && 'opacity-70')}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
