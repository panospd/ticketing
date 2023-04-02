import { useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";

const signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            email,
            password,
        },
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {!!errors && errors}
            <button className="btn btn-primary mt-2">Sign up</button>
        </form>
    );
};

export default signup;
