# DSA RAG Chatbot

A command-line chatbot that answers Data Structures & Algorithms questions from your own PDF. It uses Retrieval-Augmented Generation (RAG): the PDF is split into chunks, stored as vectors in Pinecone, and the most relevant chunks are given to Gemini to answer each question.

## How it works

```
dsa.pdf -> chunks -> Gemini embeddings -> Pinecone index
                                              |
Your question -> rewritten as standalone -> embedding -> top matches -> Gemini answer
```

1. **Indexing (`index.js`)**: loads the PDF, splits it into chunks (1000 characters, 200 overlap), embeds each chunk, and stores the vectors in Pinecone.
2. **Chatting (`query.js`)**: rewrites your follow-up question into a standalone one, embeds it, retrieves the closest chunks from Pinecone, and asks Gemini to answer using only that context.

## Tech stack

- Node.js (ES modules)
- [LangChain](https://js.langchain.com/) for PDF loading, chunking and the Pinecone store
- Google Gemini for embeddings and answers
- Pinecone as the vector database

## Project structure

| File | Purpose |
| --- | --- |
| `index.js` | Loads the PDF, chunks it, embeds it, and uploads to Pinecone |
| `query.js` | Interactive chat loop that answers questions from the indexed PDF |
| `recreateIndex.js` | Creates a Pinecone index with the right settings (768 dimensions, cosine) |
| `test-pinecone.js` | Small script for testing the Pinecone connection |
| `dsa.pdf` | The source document |

## Prerequisites

- Node.js 18 or newer
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Pinecone](https://www.pinecone.io/) account and API key

## Setup

1. **Clone the repo and install dependencies**

   ```bash
   git clone https://github.com/siyasriswal/rag.git
   cd rag
   npm install
   ```

2. **Create a `.env` file** in the project root:

   ```
   GEMINI_API_KEY=your_gemini_key
   PINECONE_API_KEY=your_pinecone_key
   PINECONE_INDEX_NAME=dsa-rag-768
   ```

   Never commit this file. It is already listed in `.gitignore`.

3. **Create the Pinecone index.** It must be a standard dense-vector index whose dimension matches your embedding model (768 for `text-embedding-004`) with the `cosine` metric. Either edit the names in `recreateIndex.js` and run:

   ```bash
   node recreateIndex.js
   ```

   or create the index in the Pinecone console with the same settings.

4. **Add your PDF** as `dsa.pdf` in the project root.

## Usage

**Index the PDF (run once, or whenever the PDF changes):**

```bash
node index.js
```

Wait for `Data Stored succesfully`.

**Start the chatbot:**

```bash
node query.js
```

Type a question at the prompt. If the answer isn't in the PDF, the bot replies: *"I could not find the answer in the provided document."*

## Troubleshooting

| Error | Likely cause and fix |
| --- | --- |
| `This index has a document schema...` | The index was created with a document schema. Create a standard dense-vector index instead. |
| `Vector dimension X does not match the dimension of the index Y` | The embedding model's output size and the index dimension differ. Recreate the index with the correct dimension. |
| `Vector dimension 0 ...` | Some chunks were empty, or the embedding model isn't available for your key. Filter empty chunks and test the model. |
| Answers say "could not find" for things in the PDF | Wait 10 to 30 seconds after indexing, and make sure the chat script uses the same embedding model and index as `index.js`. |
| `429` errors while indexing | Rate limit. Lower `maxConcurrency` in `index.js`. |

## Notes

- Model names (`text-embedding-004`, `gemini-2.0-flash`) may be retired over time. If you change the embedding model, use the same model in both `index.js` and `query.js`, set the index dimension to match, and re-index the PDF.
- Re-running `index.js` adds the chunks again. Clear the index first if you want to avoid duplicates.

## Security

API keys live only in `.env`, which is git-ignored. If a key is ever pushed by accident, regenerate it immediately.
