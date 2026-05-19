/**
 * socket.js — Singleton Socket.io instance holder.
 * Avoids circular import: server.js → app.js → order.controller.js → server.js
 */

let _io = null;

export const setIO = (io) => {
  _io = io;
};

/**
 * Returns the io instance. Returns null (with a warning) if not yet initialized,
 * so controllers can guard with: const io = getIO(); if (io) io.to(...).emit(...)
 */
export const getIO = () => {
  if (!_io) {
    console.warn("⚠️  Socket.io not yet initialized — skipping real-time emit.");
    return null;
  }
  return _io;
};
