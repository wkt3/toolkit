import { ErrorBoundary } from "react-error-boundary";

function MyFallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function MyComponent() {
  // Some component logic that may throw JS errors
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={MyFallbackComponent}
      onReset={() => {
        // reset the state of your app here
      }}
      resetKeys={["someKey"]}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
