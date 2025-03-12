"use client";

import { Link } from "react-aria-components";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the NYU Press Reader</h1>

      <h2>NYU Press Books (Local)</h2>
      <ul>
        <li>
          <Link href="/read?book=http://localhost:15080/OTc4MTQ3OTgxOTQ1NC5lcHVi">War, Conquest, and Catastrophe</Link>
        </li>
        <li>
          <Link href="/read?book=http://localhost:15080/OTc4MTQ3OTgxOTQ5Mi5lcHVi">After Stalin</Link>
        </li>
      </ul>

      <h2>NYU Press Books (EC2)</h2>
      <ul>
        <li>
          <Link href="/read?book=http://35.95.95.96:15080/OTc4MTQ3OTgxOTQ1NC5lcHVi">War, Conquest, and Catastrophe</Link>
        </li>
        <li>
          <Link href="/read?book=http://35.95.95.96:15080/OTc4MTQ3OTgxOTQ5Mi5lcHVi">After Stalin</Link>
        </li>
      </ul>

      <h2>Readium Test Books</h2>
      <ul>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FbW9ieS1kaWNrLmVwdWI">Moby Dick (reflow)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FbmF0aGFuaWVsLWhhd3Rob3JuZV90aGUtaG91c2Utb2YtdGhlLXNldmVuLWdhYmxlc19hZHZhbmNlZC5lcHVi">The House of the Seven Gables (reflow advanced)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FbGVzX2RpYWJvbGlxdWVzLmVwdWI">Les Diaboliques (reflow french)</Link>
        </li>
        <li>
          <Link href="/read?book=https%3A%2F%2Fpublication-server.readium.org%2FQmVsbGFPcmlnaW5hbDMuZXB1Yg">Bella the Dragon (FXL)</Link>
        </li>
      </ul>
    </main>
  );
}
