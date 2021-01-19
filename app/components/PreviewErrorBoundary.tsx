import React from 'react';

type PreviewErrorBoundaryProps = {
  children: React.ReactNode;
};

type PreviewErrorBoundaryState = {
  hasError: boolean;
};

export default class PreviewErrorBoundary extends React.Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // eslint-disable-next-line no-console
    // console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <h1>
          Had a tough time rendering that. Please try reformatting the MDX, or
          undo a couple times.
        </h1>
      );
    }
    return children;
  }
}
