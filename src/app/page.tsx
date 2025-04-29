"use client";

import { Link } from "react-aria-components";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the NYU Press Reader</h1>

      <h2>Jews in the Soviet Union</h2>
      <ul>
        <li>
          <Link href="/read?book=http://35.95.95.96:15080/OTc4MTQ3OTgxOTQ1NC5lcHVi">War, Conquest, and Catastrophe</Link>
        </li>
        <li>
          <Link href="/read?book=http://35.95.95.96:15080/OTc4MTQ3OTgxOTQ5Mi5lcHVi">After Stalin</Link>
        </li>
      </ul>
    </main>
  );
}
