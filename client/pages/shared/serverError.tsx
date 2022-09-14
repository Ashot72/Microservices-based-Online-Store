

const ServerError: React.FC<{ error: {message: string}}> = ({ error }) => {
   return(
    <div style={{ color: "red", textAlign: "center" }}>
    <strong>{error.message}</strong>
   </div>
   )
}

export default ServerError

