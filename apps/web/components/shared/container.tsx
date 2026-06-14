import React from "react"

// Define the props interface
interface ContainerProps {
  children: React.ReactNode
  className?: string
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={`mx-auto max-w-7xl px-4 md:px-6 lg:px-4 ${className}`}>
      {children}
    </div>
  )
}

export default Container
