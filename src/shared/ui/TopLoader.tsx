
import { useEffect, useState } from "react";

export function TopLoader({ loading }: { loading: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(()=>{
    if(loading){
      setWidth(30);
      const t = setInterval(()=>{
        setWidth(w => (w < 90 ? w + 5 : w));
      }, 200);
      return ()=>clearInterval(t);
    } else {
      setWidth(100);
      const timeout = setTimeout(()=>setWidth(0), 400);
      return ()=>clearTimeout(timeout);
    }
  },[loading]);

  return (
    <div style={{
      position:"fixed",
      top:0,
      left:0,
      height:3,
      width: width + "%",
      background:"#2563eb",
      transition:"width .3s ease",
      zIndex:9999
    }}/>
  );
}
