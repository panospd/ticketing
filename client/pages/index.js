import axios, { Axios } from "axios";

import React from "react";

const LandingPage = ({ currentUser }) => {
    return <h1>{currentUser?.email}</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
    if (typeof window === "undefined") {
        const res = await axios.get(
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/current",
            {
                headers: req.headers,
            }
        );

        return res.data;
    } else {
        const { data } = await axios.get("/api/users/current");
        return data;
    }
};

export default LandingPage;
