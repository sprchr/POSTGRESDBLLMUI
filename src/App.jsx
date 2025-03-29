import React from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
export default function App() {
  const [userQuery, setUserQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    setSqlQuery(null);
    setQueryResult(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ natural_language_query: userQuery }),
      });
      const data = await response.json();
      setSqlQuery(data.query);
      setQueryResult(data.result);
      console.log(data.result)
    } catch (error) {
      console.error("Error fetching query:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <QueryInput
        userQuery={userQuery}
        setUserQuery={setUserQuery}
        handleQuery={handleQuery}
        loading={loading}
      />
      {sqlQuery && (
        <QueryResult title="Generated SQL Query:" content={sqlQuery} />
      )}
      {queryResult && (
        <QueryResult
          title="Query Result:"
          content={queryResult}
        />
        
      )}
    </div>
  );
}

function QueryInput({ userQuery, setUserQuery, handleQuery, loading }) {
  return (
    <Card className="w-full max-w-2xl p-4 shadow-lg">
      <CardContent className="space-y-4">
        <Typography variant="h6">Enter Your Query</Typography>
        <TextField
          fullWidth
          placeholder="E.g., Show all students enrolled in Mathematics"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleQuery}
          disabled={loading}
          className="top-5"
        >
          {loading ? "Processing..." : "Generate SQL & Fetch Data"}
        </Button>
      </CardContent>
    </Card>
  );
}

function QueryResult({ title, content }) {
  return (
    <Card className="w-full max-w-2xl p-4 shadow-md">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography
          component="pre"
          className="bg-gray-100 p-2 rounded text-sm overflow-auto"
        >
          {content.flat().join("\n")}
        </Typography>
      </CardContent>
    </Card>
  );
}
