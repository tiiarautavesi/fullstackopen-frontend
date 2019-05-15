import React from 'react' 

const LoginForm = ({
   handleSubmit,
   handleUsernameChange,
   handlePasswordChange,
   username, 
   password 
  }) => {
  return (
    <div className="loginForm">
      <h2>Kirjaudu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
      </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm