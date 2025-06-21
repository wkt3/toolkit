declare global {
  interface Window {
    fx: {
      canvas: () => any
    }
  }
}

export {}