"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

import { useEdgeStore } from "@/lib/edgestore";
import { Block } from "@blocknote/core";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { string } from "zod";


interface EditorProps {
  onChange?: (value: string) => void;
  initialContentt?: string;
  
};

const Editor = ({
    onChange,
    initialContentt,
}: EditorProps) => {

    const update = useMutation(api.documents.update)
    const params = useParams();
    console.log(params.content)
    const idDocument = params.documentId as Id<"documents">;
    
    async function saveToStorage(jsonBlocks: Block[]) {
        // Save contents to local storage. You might want to debounce this or replace
        // with a call to your API / database.
        localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
        const content = JSON.stringify(jsonBlocks);
        update({
          id: idDocument,
          content: content
        });
      }
       
      async function loadFromStorage() {
        // Gets the previously stored editor contents.
        const storageString = localStorage.getItem("editorContent");
        return storageString
          ? (JSON.parse(storageString) as PartialBlock[])
          : undefined;
      }
        const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | "loading">("loading");
       
        // Loads the previously stored editor contents.
        useEffect(() => {
          loadFromStorage().then((content) => {
            setInitialContent(content);
          });
        }, []);
       
        // Creates a new editor instance.
        // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
        // can delay the creation of the editor until the initial content is loaded.
        const editor = useMemo(() => {
          if (initialContent === "loading") {
            return undefined;
          }
          /* if (idDocument === ) */
          return BlockNoteEditor.create({ initialContent });
        }, [initialContent]);
       
        if (editor === undefined) {
          return "Loading content...";
        }
       
        // Renders the editor instance.
        return (
          <BlockNoteView
            editor={editor}
            onChange={() => {
              saveToStorage(editor.document);
            }}
          />
        );
      }

export default Editor;

