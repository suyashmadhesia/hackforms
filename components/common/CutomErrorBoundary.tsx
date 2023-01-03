import { NextRouter } from "next/router";
import React, { ErrorInfo, ReactNode } from "react"

interface Props {
    children?: ReactNode;
    router: NextRouter;
  }
  
  interface State {
    hasError: boolean;
  }

class CustomErrorBoundary extends React.Component<Props,State> {

    constructor(props: Props) {
      super(props)
  
      // Define a state variable to track whether is an error or not
      this.state = { hasError: false };
      this.routeToLogin = this.routeToLogin.bind(this)
      this.handleTryAgainClick = this.handleTryAgainClick.bind(this)
    }


    static getDerivedStateFromError(error: Error): State {
      // Update state so the next render will show the fallback UI
  
      return { hasError: true }
    }

    routeToLogin() {
        this.props.router.push('/login?redirected=true');
        this.props.router.reload()
    }

    handleTryAgainClick() {
        this.setState({ hasError: false })
        this.routeToLogin()
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      // You can use your own error logging service here
      console.log({ error, errorInfo });
      this.routeToLogin()
    }


    render() {
      // Check if the error is thrown
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <div>
            <h2>Oops, there is an error!</h2>
            <button
              type="button"
              onClick={() => this.handleTryAgainClick()}
            >
              Try again?
            </button>
          </div>
        )
      }
  
      // Return children components in case of no error
  
      return this.props.children
    }
  }
  
  export default CustomErrorBoundary