"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { cn } from "@/shared/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { Roadmap } from "@/shared/types";

export interface ExportButtonProps {
  roadmap: Roadmap;
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const TOP_MARGIN = 16;

const C = {
  bg: [247, 248, 245] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  black: [23, 33, 27] as [number, number, number],
  gray: [104, 115, 108] as [number, number, number],
  lightGray: [243, 245, 241] as [number, number, number],
  border: [223, 229, 222] as [number, number, number],
  headerBg: [242, 246, 244] as [number, number, number],
  headerBorder: [214, 226, 219] as [number, number, number],
  orange: [232, 93, 63] as [number, number, number],
  orangeLight: [252, 235, 231] as [number, number, number],
  blue: [37, 99, 235] as [number, number, number],
  green: [22, 163, 74] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
};

function getResourceColor(type: string): [number, number, number] {
  switch (type.toLowerCase()) {
    case "video":
      return C.red;
    case "article":
      return C.blue;
    case "project":
      return C.green;
    default:
      return C.orange;
  }
}

/**
 * Modern Export PDF Button component generating beautiful structured roadmap documents.
 */
export function ExportButton({ roadmap }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!roadmap) return;
    setIsExporting(true);

    try {
      const jsPDF = (await import("jspdf")).default;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let yPos = TOP_MARGIN;
      let pageCount = 1;

      const drawPageBackground = () => {
        doc.setFillColor(...C.bg);
        doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
      };

      const drawHeader = (isFirst: boolean) => {
        if (!isFirst) {
          doc.setTextColor(...C.gray);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          doc.text("Coursenva — Learning Roadmap", MARGIN, 12);
          doc.text(`Page ${pageCount}`, PAGE_WIDTH - MARGIN, 12, {
            align: "right",
          });
          doc.setDrawColor(...C.border);
          doc.setLineWidth(0.3);
          doc.line(MARGIN, 15, PAGE_WIDTH - MARGIN, 15);
        }
      };

      const checkBreak = (needed: number) => {
        if (yPos + needed > PAGE_HEIGHT - 20) {
          doc.addPage();
          pageCount++;
          drawPageBackground();
          drawHeader(false);
          yPos = 22;
          return true;
        }
        return false;
      };

      drawPageBackground();

      // Top Brand Header Banner
      doc.setFillColor(...C.orange);
      doc.circle(MARGIN + 3, yPos + 3, 3, "F");
      doc.setTextColor(...C.black);
      doc.setFontSize(13.5);
      doc.setFont("helvetica", "bold");
      doc.text("Coursenva", MARGIN + 8, yPos + 4.5);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.gray);
      doc.text(
        "AI-powered learning resource discovery",
        MARGIN + 42,
        yPos + 4.5,
      );

      doc.text(
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        PAGE_WIDTH - MARGIN,
        yPos + 4.5,
        { align: "right" },
      );

      yPos += 13;

      // Roadmap Header Card text splitting & dynamic height
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(roadmap.title, CONTENT_WIDTH - 16);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(
        roadmap.description,
        CONTENT_WIDTH - 16,
      );

      const durationText = `Duration: ${roadmap.totalDuration}`;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const durationPillWidth = Math.max(
        doc.getTextWidth(durationText) + 8,
        45,
      );

      const headerCardHeight =
        8 +
        6 +
        titleLines.length * 6.5 +
        3 +
        descLines.length * 4.5 +
        6 +
        7 +
        6;

      doc.setFillColor(...C.headerBg);
      doc.setDrawColor(...C.headerBorder);
      doc.setLineWidth(0.4);
      doc.roundedRect(
        MARGIN,
        yPos,
        CONTENT_WIDTH,
        headerCardHeight,
        3.5,
        3.5,
        "FD",
      );

      let cardY = yPos + 8;

      doc.setTextColor(...C.orange);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text("YOUR LEARNING ROADMAP", MARGIN + 8, cardY);

      cardY += 6;
      doc.setTextColor(...C.black);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(titleLines, MARGIN + 8, cardY);

      cardY += titleLines.length * 6.5 + 3;
      doc.setTextColor(...C.gray);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text(descLines, MARGIN + 8, cardY);

      cardY += descLines.length * 4.5 + 6;

      // Duration Badge Pill
      doc.setFillColor(...C.orangeLight);
      doc.setDrawColor(...C.orange);
      doc.setLineWidth(0.2);
      doc.roundedRect(
        MARGIN + 8,
        cardY - 3.5,
        durationPillWidth,
        7,
        1.5,
        1.5,
        "FD",
      );
      doc.setTextColor(...C.orange);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(durationText, MARGIN + 12, cardY + 1.2);

      yPos += headerCardHeight + 12;

      // Learning Path Section Title
      doc.setTextColor(...C.gray);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("RECOMMENDED LEARNING PATH", MARGIN, yPos);
      yPos += 7;

      // Step Cards Loop
      roadmap.steps.forEach((step) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const stepTitleLines = doc.splitTextToSize(
          step.title,
          CONTENT_WIDTH - 24,
        );

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const stepDescLines = doc.splitTextToSize(
          step.description,
          CONTENT_WIDTH - 24,
        );

        const titleHeight = stepTitleLines.length * 5.2;
        const descHeight = stepDescLines.length * 4.2;
        const cardContentHeight = 12 + titleHeight + 3 + descHeight + 6;

        let resourcesHeight = 0;
        const MAX_TEXT_WIDTH = CONTENT_WIDTH - 44;

        if (step.resources && step.resources.length > 0) {
          resourcesHeight += 10;
          step.resources.forEach((res) => {
            doc.setFontSize(9);
            const resTitleLines = doc.splitTextToSize(
              res.title,
              MAX_TEXT_WIDTH,
            );

            doc.setFontSize(7);
            const urlLines = doc.splitTextToSize(res.url, MAX_TEXT_WIDTH);

            const rowHeight = Math.max(
              resTitleLines.length * 4.2 + urlLines.length * 3.2 + 5,
              13,
            );
            resourcesHeight += rowHeight + 3.5;
          });
        }

        const boxHeight = cardContentHeight + resourcesHeight + 4;

        checkBreak(boxHeight + 10);

        // Main White Step Card
        doc.setFillColor(...C.white);
        doc.setDrawColor(...C.border);
        doc.setLineWidth(0.4);
        doc.roundedRect(MARGIN, yPos, CONTENT_WIDTH, boxHeight, 3.5, 3.5, "FD");

        // Step Number Badge Circle
        doc.setFillColor(...C.orange);
        doc.circle(MARGIN + 8, yPos + 9, 4.5, "F");
        doc.setTextColor(...C.white);
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "bold");
        doc.text(String(step.step), MARGIN + 8, yPos + 10.3, {
          align: "center",
        });

        // Step Title & Description
        let stepY = yPos + 9;
        doc.setTextColor(...C.black);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(stepTitleLines, MARGIN + 16, stepY);

        stepY += titleHeight + 3;
        doc.setTextColor(...C.gray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(stepDescLines, MARGIN + 16, stepY);

        stepY += descHeight + 6;

        // Structured Resources Section inside Step Card
        if (step.resources && step.resources.length > 0) {
          doc.setDrawColor(...C.border);
          doc.setLineWidth(0.3);
          doc.line(MARGIN + 6, stepY - 2, PAGE_WIDTH - MARGIN - 6, stepY - 2);

          doc.setTextColor(...C.gray);
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.text("RECOMMENDED RESOURCES", MARGIN + 6, stepY + 3);
          stepY += 7;

          // Fixed 2-column layout parameters for resource alignment
          const BADGE_WIDTH = 26; // Uniform width for resource type badges
          const TITLE_X = MARGIN + 36; // Constant X alignment for resource titles and URLs

          step.resources.forEach((res) => {
            const resColor = getResourceColor(res.type);
            const resTypeText = res.type.toUpperCase();

            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            const resTitleLines = doc.splitTextToSize(
              res.title,
              MAX_TEXT_WIDTH,
            );

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            const urlLines = doc.splitTextToSize(res.url, MAX_TEXT_WIDTH);

            const rowHeight = Math.max(
              resTitleLines.length * 4.2 + urlLines.length * 3.2 + 5,
              13,
            );

            // Light Container Box for Each Resource Row
            doc.setFillColor(...C.lightGray);
            doc.setDrawColor(...C.border);
            doc.setLineWidth(0.2);
            doc.roundedRect(
              MARGIN + 6,
              stepY,
              CONTENT_WIDTH - 12,
              rowHeight,
              1.5,
              1.5,
              "FD",
            );

            // Fixed Width Centered Badge
            doc.setFillColor(...resColor);
            doc.roundedRect(
              MARGIN + 9,
              stepY + 3.5,
              BADGE_WIDTH,
              5.2,
              1,
              1,
              "F",
            );
            doc.setTextColor(...C.white);
            doc.setFontSize(6);
            doc.setFont("helvetica", "bold");
            doc.text(resTypeText, MARGIN + 9 + BADGE_WIDTH / 2, stepY + 7, {
              align: "center",
            });

            // Resource Title (Aligned perfectly at TITLE_X)
            let textY = stepY + 4.5;
            doc.setTextColor(...C.black);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text(resTitleLines, TITLE_X, textY);

            // Resource URL (Aligned perfectly at TITLE_X)
            textY += resTitleLines.length * 4.2 + 1;
            doc.setTextColor(...C.blue);
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.text(urlLines, TITLE_X, textY);

            stepY += rowHeight + 3.5;
          });
        }

        yPos += boxHeight + 6;
      });

      // Document Footer Line
      const footerY = PAGE_HEIGHT - 12;
      doc.setDrawColor(...C.border);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, footerY - 4, PAGE_WIDTH - MARGIN, footerY - 4);

      doc.setTextColor(...C.gray);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text("Generated by Coursenva", MARGIN, footerY);
      doc.text(
        `Page ${pageCount} of ${pageCount}`,
        PAGE_WIDTH - MARGIN,
        footerY,
        { align: "right" },
      );

      doc.save(`${roadmap.topic.replace(/[^a-z0-9]/gi, "_")}_roadmap.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="secondary"
      className={cn("gap-2", isExporting && "opacity-70")}
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
