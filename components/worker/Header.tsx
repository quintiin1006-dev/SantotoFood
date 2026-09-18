"use client";

import Image from "next/image";
import { Search } from "lucide-react";

import styles from "./Header.module.css";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Header({
  search,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoWrapper}>
          <Image
            src="/santoto-logo.jpeg"
            alt="Universidad Santo Tomás"
            width={64}
            height={64}
            className={styles.logo}
            priority
          />
        </div>

        <div className={styles.brandInfo}>
          <h1>
            Santoto<span>Food</span>
          </h1>

          <p>Cafetería U. Santo Tomás</p>
        </div>
      </div>

      <div className={styles.actions}>
        <label className={styles.search}>
          <Search
            size={19}
            strokeWidth={2.2}
            className={styles.searchIcon}
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Buscar estudiante o producto..."
            aria-label="Buscar estudiante o producto"
          />
        </label>

        <div className={styles.status}>
          <span className={styles.statusDot} />

          <span>En línea</span>
        </div>
      </div>
    </header>
  );
}