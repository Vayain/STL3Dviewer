import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the STL viewer application
  
  // GET endpoint to check server status
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok", message: "STL Showcase API is running" });
  });

  // The application primarily uses client-side processing for STL files
  // so we don't need many server endpoints

  const httpServer = createServer(app);

  return httpServer;
}
