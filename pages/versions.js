import { useEffect, useState } from "react"



const versions = () => {
    const [versionInfo, setVersionInfo] = useState()
    useEffect(() => {
        const headers = {
            "Access-Control-Request-Headers": 'Authorization',
            "Content-Type": "application/json",
        }
        async function fetchData() {
            // You can await here
            const res = await fetch('https://vraijwch8c.execute-api.us-east-1.amazonaws.com/stg/status', {
                method: "GET",
                headers: headers
            })
           const data = await res.json()
           console.log(data)
           if (data?.data) {
                setVersionInfo(data.data)
           }
        }
        fetchData();
        
    }, [])
    return (
        <div style={{padding: 30}}>
            <div>Api version: {versionInfo?.apiVersion}</div>
            <div>Front End version: {process.env.NEXT_APP_VERSION}</div>
        </div>
    )
}

export default versions 