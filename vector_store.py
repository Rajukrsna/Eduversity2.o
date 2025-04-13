import faiss
from sentence_transformers import SentenceTransformer

class RAGVectorStore:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = None
        self.documents = []

    def build_index(self, docs):
        self.documents = docs
        embeddings = self.model.encode(docs)
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

    def retrieve(self, query, k=3):
        query_vec = self.model.encode([query])
        _, indices = self.index.search(query_vec, k)
        return [self.documents[i] for i in indices[0]]
