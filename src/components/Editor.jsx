/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { TiptapExtensions } from './tiptapExtensions';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';




const Editor = ({ currentFile, ydocs, setYdocs, workspaceID, docID, username }) => {
  const [markdownContent, setMarkdownContent] = useState('');

  //TODO: PUT YOUR Y DOC FROM IDB OR WHEREVER YOU'RE GETTING IT HERE
  const ydoc = new Y.Doc();

  //TODO: REPLACE ROOM ID WITH FILE ID HERE
  const provider = new WebrtcProvider('Chronicle R-1', ydoc, {
    signaling: ['ws://chroniclesignalling.anuragrao.me:6969'],
  });


  const editor = useEditor({
    extensions: [
      ...TiptapExtensions,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: username,
          color: '#484848',
        },
      }),
    ],
    content: '<h1>Hello Chronicle!</h1><h2>A real-time markdown editor</h2>',
    onUpdate: ({ editor }) => {
      setMarkdownContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const saveContent = () => {
      if (editor) {
        const content = editor.getHTML();
        localStorage.setItem(docID, content);
      }
    };

    window.addEventListener('beforeunload', saveContent);

    const savedContent = localStorage.getItem(docID);
    if (savedContent) {
      editor?.commands.setContent(savedContent);
    }

    return () => {
      window.removeEventListener('beforeunload', saveContent);
    };
  }, [editor, docID]);

  return (
    <div className="w-full h-full markdown-editor tiptap">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
