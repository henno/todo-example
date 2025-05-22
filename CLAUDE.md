# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple todo app built with Bun, TypeScript, and planned to use Express and Handlebars. The project is in early development stages with only a basic setup and planned features outlined.

## Commands

### Development
- **Install dependencies**: `bun install`
- **Run the application**: `bun run index.ts`
- **Type checking**: `bun run typecheck` (equivalent to `tsc --noEmit`)

### Planned Features
1. Add todo items
2. Mark items as completed
3. Delete todo items
4. View all todo items
5. View completed/incomplete items

## Architecture

The project is currently using:
- **Bun**: JavaScript runtime
- **TypeScript**: For type safety
- **Planned**: Express and Handlebars for backend and templating

The project is set up as an ESM module with strict TypeScript configuration.