import React, { useEffect, useMemo, useState } from "react";
import './BaseTable.css';
import Link from "../../assets/images/link.svg"
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const BaseTable = ({ header = [], data = [],search = "" }) => {
  const openTX = (tx) => {
    window.open(tx);
  }
  const timeAgo = (date) => {
    const distance = new Date() - new Date(date) ;
    const days =  Math.floor(distance / (1000 * 60 * 60 *24)) ;
    const hours =  Math.floor((distance % (1000 * 60 * 60 *24) / (1000 * 60 * 60))) ;
    const minutes =  Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) ;
    const seconds =  Math.floor((distance % (1000 * 60)) / 1000) ;
    if (days > 0)
      return days + " days ago"
    else if (hours > 0)
      return hours + " hours ago"
    else if (minutes > 0)
      return minutes + " minutes ago"
    else if (seconds > 0)
      return seconds + " seconds ago"
    else
      return "Just now"
  }
  const [pageOffset,setPageOffset] = useState(0);
  const changeOffset = (type) => {
    switch(type){
      case "inc":
        setPageOffset(pageOffset + 10 > len ? pageOffset : pageOffset + 10);
        break;
      case "dec":
        setPageOffset(pageOffset - 10 < 0 ? pageOffset : pageOffset - 10);
        break;
      default:
        break
    }
  }
  useEffect(() => {
    setPageOffset(0);
  },[search])
  const regex = new RegExp(search, "gi");
  const newData = useMemo(() => 
  data.filter((activity) => {
    return activity.position?.toString().match(regex) || activity.type?.toString().match(regex) || activity.amount?.toString().match(regex);
  }
  ),[data.length,search]);
  const len = newData.length;
  const activity  = useMemo(() => {
    const activityStore = [...newData];
    return activityStore.slice(pageOffset,(pageOffset + 10 > len ? len: pageOffset + 10))
  },[newData.length,pageOffset]);
  return (
    <div className="main-table-wrapper">
    <div className="tbl-header">
      <table cellPadding="0" cellSpacing="0" border="0">
      <thead>
        <tr>
          {header.map((item, idx)=>{
            return <th key={idx}>{item}</th>
          })}
        </tr>
      </thead>
      </table>
    </div>
    <div className="tbl-content">
    <table cellPadding="0" cellSpacing="0" border="0">
      <tbody>
      {activity.map(({ date, type, position, amount, tx }, idx) => {
          return (
            <tr key={idx}>
              <td>{timeAgo(date)}</td>
              <td>{type}</td>
              <td>{position}</td>
              <td>{amount}</td>
              <td onClick={() => openTX("https://rinkeby.etherscan.io/tx/"+tx)}><p className="tx-link">link&nbsp;</p><img src={Link} alt="" className="image-link tx-link"/></td>
            </tr>
          );
        })}
        {activity.length === 0 && <tr><td className="no-data">No data avaiable</td></tr>}
      </tbody>
    </table>
   </div>
   {len > 10 &&
      <div className="pagination">
        <p onClick={() => changeOffset("dec")} className={pageOffset === 0 ? "disable" : ""}><ChevronLeftIcon /></p>
        <p className="number">{parseInt(pageOffset/10 + 1)}</p>
        <p onClick={() => changeOffset("inc")} className={pageOffset + 10 > len ? "disable" : ""}><ChevronRightIcon /></p>
      </div>
    }
  </div>
  );
};

export default BaseTable;