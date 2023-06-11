import { FormEvent, useState } from "react";

const httpRequest = {
  post: (url: string, body: any) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },
};

export default function Home() {
  const [previousDescription, setPreviousDescription] = useState("");
  const [currentDescription, setCurrentDescription] = useState(
    "I am feeling unwell after eating a dead fish, and drinking an outdated coke"
  );
  const [result, setResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentDescription) return;
    setIsLoading(true);
    const response = await httpRequest.post("/api/diagnose", {
      description: currentDescription,
    });
    setIsLoading(false);
    if (!response.ok) {
      setErrorMessage("Something went wrong!");
      return;
    }
    setPreviousDescription(currentDescription);
    setCurrentDescription("");
    setErrorMessage("");
    const data = await response.json();
    setResult(data.diagnosis);
  };

  return (
    <main>
      <h1>Descripe your symptoms</h1>
      <form
        className="form"
        onSubmit={handleSubmit}
        style={{ display: "flex" }}
      >
        <input
          style={{
            width: "100%",
          }}
          type="text"
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
        />
        <button type="submit">Diagnose</button>
      </form>
      {isLoading && <p>Loading...</p>}
      <h2>Description</h2>
      {previousDescription && <p>{previousDescription}</p>}
      <h2>Diagnosis</h2>
      {result && <p>{result}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </main>
  );
}
