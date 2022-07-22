import { useState } from "react"
import useRequest from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {doRequest, errors} = useRequest(
        {
            url: "/api/users/signup",
            method: "post",
            body: {
                email, password
            }
        }
    )

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign up</h1>
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input 
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="form-control" 
                    type="password" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}