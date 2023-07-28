"use client";

import { useChat } from "ai/react";
import { FormEvent } from "react";
import { convertMdToHtml } from "~/utils/markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: "/api/diagnose",
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setMessages([]);
    handleSubmit(e);
  };

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <div style={{ fontWeight: "bold" }}>{m.role}:</div>
          <div
            dangerouslySetInnerHTML={{ __html: convertMdToHtml(m.content) }}
          ></div>
        </div>
      ))}

      <form onSubmit={onSubmit}>
        <label style={{ width: "100%" }}>
          <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Describe your symptoms
          </div>
          <input
            style={{ width: "100%" }}
            value={input}
            onChange={handleInputChange}
          />
        </label>
      </form>
    </div>
  );
}
