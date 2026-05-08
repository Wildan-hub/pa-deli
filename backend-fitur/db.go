package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    "github.com/joho/godotenv"
    _ "github.com/lib/pq"
)

var db *sql.DB

func connectDB() {
    godotenv.Load()
    connStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
        os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), 
        os.Getenv("DB_NAME"), os.Getenv("DB_PORT"), os.Getenv("DB_SSLMODE"))

    var err error
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    
    if err = db.Ping(); err != nil {
        log.Fatal("Koneksi gagal:", err)
    }
    log.Println("Database terhubung! 🚀")
}