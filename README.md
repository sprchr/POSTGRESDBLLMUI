
# React Frontend for Natural Language to SQL Query

This document describes the React frontend application that allows users to input natural language queries and receive corresponding SQL queries and results.

## Overview

The frontend is built using React and Material-UI. It provides a user interface to:

-   Enter natural language queries.
-   Display the generated SQL query.
-   Display the results of the SQL query.

The frontend communicates with a backend API (running on `http://127.0.0.1:8000/query`) to generate and execute SQL queries.

# Natural Language to SQL Backend API

This document describes the backend API that converts natural language queries into SQL queries for a PostgreSQL database.

## Overview

The backend is built using FastAPI and integrates with OpenAI's GPT models and Pinecone for schema indexing. It provides an API endpoint to receive natural language queries, generate corresponding SQL queries, and execute them against a PostgreSQL database.


## Project Structure


src/
├── App.jsx          // Main application component
└── main.jsx        // Entry point of the application
=======
nl2sql_backend/
├── app/
│   ├── main.py           # FastAPI application entry point
│   ├── config.py         # Configuration settings (DB, API keys)
│   ├── db/
│   │   ├── database.py     # PostgreSQL connection logic
│   │   ├── schema_index.py # Pinecone schema indexing & retrieval
│   ├── models/
│   │   ├── request_models.py # Pydantic request models
│   ├── services/
│   │   ├── llm_service.py    # OpenAI LLM query generation
│   │   ├── sql_executor.py   # Executes SQL queries on PostgreSQL
│   │   ├── schema_retriever.py # Retrieve relevant schema from pinecone
│   ├── routes/
│   │   ├── query_routes.py   # API endpoints
├── requirements.txt      # Dependencies
├── README.md             # Project documentation
>>>>>>> d07fceb (first commit)
```

## Dependencies

-   `react`: Core React library.
-   `@mui/material`: Material-UI components for styling.
-   `@mui/icons-material`: Material-UI icons.

## Components

### `App` Component

The `App` component is the main component that manages the state and logic of the application.

**State Variables:**

-   `userQuery`: Stores the user's natural language query.
-   `sqlQuery`: Stores the generated SQL query.
-   `queryResult`: Stores the result of the SQL query.
-   `loading`: Indicates whether the application is currently processing a query.

**Functions:**

-   `handleQuery`: Sends the `userQuery` to the backend API, receives the `sqlQuery` and `queryResult`, and updates the state.

**Rendering:**

-   Renders the `QueryInput` component for user input.
-   Renders the `QueryResult` component to display the generated SQL query (if available).
-   Renders the `QueryResult` component to display the query results (if available).

### `QueryInput` Component

The `QueryInput` component provides a text field for users to enter their queries and a button to trigger the query processing.

**Props:**

-   `userQuery`: The current value of the user's query.
-   `setUserQuery`: A function to update the `userQuery` state.
-   `handleQuery`: A function to trigger the query processing.
-   `loading`: A boolean indicating whether the application is currently processing a query.

**Rendering:**

-   Renders a Material-UI `Card` component.
-   Renders a Material-UI `TextField` for user input.
-   Renders a Material-UI `Button` to trigger the query processing.

### `QueryResult` Component

The `QueryResult` component displays the generated SQL query or the query result.

**Props:**

-   `title`: The title of the result (e.g., "Generated SQL Query:" or "Query Result:").
-   `content`: The content to display (either the SQL query or the query result).

**Rendering:**

-   Renders a Material-UI `Card` component.
-   Renders a Material-UI `Typography` component for the title.
-   Renders a Material-UI `Typography` component with `component="pre"` to display the content as preformatted text.
-   The content is flattened and joined with newlines for better display of array data.

## API Interaction

The frontend sends a POST request to `http://127.0.0.1:8000/query` with the user's query in JSON format:

```json
{
  "natural_language_query": "Show all students enrolled in Mathematics"
}
```

The backend API responds with a JSON object containing the generated SQL query and the query result:

```json
{
  "query": "SELECT * FROM students WHERE course = 'Mathematics';",
  "result": [["student1", "Mathematics"], ["student2", "Mathematics"]]
}
```

## Styling

The application uses Material-UI for styling. Custom CSS classes are also used for layout and formatting.

## Usage

1.  **Start the React application:**

    ```bash
    npm start
    ```

2.  **Ensure the backend API is running at `http://127.0.0.1:8000/query`.**

3.  Open the application in your browser.

4.  Enter a natural language query in the text field.

5.  Click the "Generate SQL & Fetch Data" button.

6.  The generated SQL query and the query results will be displayed below the input field.

## Notes

-   The backend API is assumed to be running locally on port 8000.
-   The `queryResult` is flattened and joined with newlines for display. This handles the case where the result is a multi-dimensional array.
-   Error handling for API requests is limited to logging errors to the console.
-   The UI utilizes tailwind css classes within the Material UI components.

-   `fastapi`: Web framework for building APIs.
-   `uvicorn`: ASGI server for running FastAPI applications.
-   `openai`: OpenAI Python library for interacting with GPT models.
-   `psycopg2`: PostgreSQL adapter for Python.
-   `pinecone-client`: Pinecone client library for vector database interaction.
-   `python-dotenv`: Load environment variables from a `.env` file.
-   `pydantic`: Data validation and settings management using Python type annotations.

## Configuration

Environment variables are used for configuration. Create a `.env` file in the project root with the following variables:

```
PINECONE_API_KEY=<your_pinecone_api_key>
OPENAI_API_KEY=<your_openai_api_key>
DB_NAME=<your_db_name>
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_HOST=<your_db_host>
DB_PORT=<your_db_port>
```

## Components

### `app/main.py`

-   Initializes the FastAPI application.
-   Includes the `query_routes` router.
-   Provides an entry point for running the application using Uvicorn.

### `app/config.py`

-   Loads environment variables using `python-dotenv`.
-   Defines configuration settings for Pinecone, OpenAI, and the PostgreSQL database.

### `app/db/database.py`

-   Provides a function `get_db_connection()` to establish a connection to the PostgreSQL database.

### `app/db/schema_index.py`

-   Initializes the Pinecone client.
-   Provides a function `index_schema()` to index the database schema in Pinecone.
    -   Retrieves table and column names from the PostgreSQL database.
    -   Stores schema information in Pinecone with table names as IDs and schema descriptions as metadata.

### `app/services/schema_retriever.py`

-   Provides a function `get_relevant_tables(nl_query: str)` to retrieve the most relevant database schema details for a given query from Pinecone.

### `app/services/llm_service.py`

-   Uses OpenAI's GPT models to convert natural language queries into SQL.
-   `generate_sql_query(nl_query: str)`:
    -   Retrieves relevant schema from Pinecone using `get_relevant_tables`.
    -   Constructs a prompt with the schema and the natural language query.
    -   Sends the prompt to the GPT model and returns the generated SQL query.

### `app/services/sql_executor.py`

-   Executes SQL queries on the PostgreSQL database.
-   `execute_sql(query: str)`:
    -   Establishes a database connection.
    -   Executes the SQL query.
    -   Returns the query result.
    -   Handles exceptions and returns an error message if the query fails.

### `app/routes/query_routes.py`

-   Defines the API endpoint for processing natural language queries.
-   `process_query(request: QueryRequest)`:
    -   Receives a `QueryRequest` object containing the natural language query.
    -   Generates the SQL query using `generate_sql_query`.
    -   Executes the SQL query using `execute_sql`.
    -   Returns the generated SQL query and the query result.
    -   Handles exceptions and returns an HTTP 500 error if an error occurs.

### `app/models/request_models.py`

-   Defines the Pydantic model `QueryRequest` for the request body.
-   `QueryRequest`:
    -   `natural_language_query`: The natural language query string.

## Setup and Usage

1.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Environment Variables:**

    -   Create a `.env` file in the project root with the required environment variables.

3.  **Index Database Schema:**

    -   Run the `index_schema()` function to index the database schema in Pinecone. This needs to be done once after setting up the database.

    ```bash
    python -m app.db.schema_index
    ```

4.  **Start the API Server:**

    ```bash
    uvicorn app.main:app --reload
    ```

5.  **Send Queries:**

    -   Send POST requests to `http://127.0.0.1:8000/query` with a JSON payload containing the natural language query:

    ```json
    {
      "natural_language_query": "Show all students enrolled in Mathematics"
    }
    ```

    -   The API will respond with a JSON object containing the generated SQL query and the query result:

    ```json
    {
      "sql_query": "SELECT * FROM students WHERE course = 'Mathematics';",
      "result": [["student1", "Mathematics"], ["student2", "Mathematics"]]
    }
    ```

## Notes

-   Ensure that the PostgreSQL database and Pinecone index are properly configured and accessible.
-   The GPT model used is `gpt-4`, which requires an OpenAI API key with access to GPT-4.
-   Error handling is implemented to catch exceptions and return appropriate error messages.
-   The `schema_index.py` needs to be run once to index the database schema.
-   The Pinecone environment is set to `us-west1-gcp` in this example. Modify it if needed
