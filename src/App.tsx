import { useToast } from "@/hooks/use-toast";
import { ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/toaster";
import { create_sourceFile } from "./lib/generate/create_sourceFile";
import { formatSourceFileText } from "./lib/readWrite/formatSourceFileText";
import { highlightSourceFileText } from "./lib/readWrite/highlightSourceFileText";
import { stringifyNodes } from "./lib/readWrite/stringifyNodes";
import { tokenizeTsvFile } from "./lib/tokenize/tokenizeTsvFile";

export function App() {
  const [reportName, setReportName] = useState("REPORT_NAME_PLACEHOLDER");
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const debouncedReportName = useDebounce(reportName, 500);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function effect() {
      if (!debouncedInput || !reportName) {
        return;
      }

      setIsError(false);
      try {
        const rawTsv = input;

        const tsvRows = tokenizeTsvFile({ tsv: rawTsv });
        const sourceFile = await create_sourceFile({
          rows: tsvRows,
          reportName: reportName,
        });
        const sourceText = stringifyNodes(sourceFile);
        const formattedTs = await formatSourceFileText({
          sourceFileText: sourceText,
        });
        const highlightedTs = await highlightSourceFileText({
          sourceFileText: formattedTs,
        });

        setOutput(highlightedTs);
      } catch (e) {
        setIsError(true);
      }
    }

    effect();
  }, [debouncedInput, debouncedReportName]);

  const handleClickCopyToClipboard = async () => {
    const rawTsv = input;

    const tsvRows = tokenizeTsvFile({ tsv: rawTsv });
    const tsNodes = await create_sourceFile({
      rows: tsvRows,
      reportName: reportName,
    });
    const rawTs = stringifyNodes(tsNodes);
    const formattedTs = await formatSourceFileText({ sourceFileText: rawTs });

    try {
      await navigator.clipboard.writeText(formattedTs);
      toast({ title: "Copied!" });
    } catch (err) {
      alert(JSON.stringify(err));
    }
  };

  useEffect(() => {
    if (isError) {
      toast({ title: "Error!" });
    }
  }, [isError]);

  return (
    <>
      <div className="flex flex-1 gap-2">
        <div className="flex flex-1 flex-col">
          <Textarea
            placeholder="TSV data..."
            onInput={(e) => setInput(e.currentTarget.value)}
            className="flex-1"
            value={input}
          />
          <div className="flex-1">
            <Input
              name="reportName"
              placeholder="Report name"
              value={reportName}
              onInput={(e) => setReportName(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
          <div
            dangerouslySetInnerHTML={{ __html: output }}
            className={"max-h-full overflow-auto"}
          />
          <div className="absolute right-5 top-5">
            <Button onClick={handleClickCopyToClipboard}>
              <ClipboardDocumentIcon />
              Copy
            </Button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}