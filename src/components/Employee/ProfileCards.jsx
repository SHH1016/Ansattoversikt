import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import "../../styles/profilecards.css"
import profileImage from "../../assets/images/default-img.png"

const ProfileCards = ({ employees, loading, error }) => {
  const navigate = useNavigate();

    if (!Array.isArray(employees)) return <p>Ingen ansatte å vise</p>;

    if (loading) return <p>Laster inn ansatte...</p>;
    if (error) return <p>Feil: {error}</p>;

    const handleClick = (employeeId) => {
      navigate(`/employee-info/${employeeId}`);}
  return (
    <>
    {employees.map((employee) =>(
            
    <div key ={employee.employee_id} className={`profile-card ${
        employee.workPosistion_title === "Admin" || employee.workPosistion_title === "Teamleder"
          ? "pink-border"
          : "blue-border"
      }`}
    >
      <div className={`background-color ${
  employee.workPosistion_title === "Admin" || employee.workPosistion_title === "Teamleder"
    ? "pink-bg"
    : "blue-bg"
}`}
onClick={() => handleClick(employee.employee_id)} //  gjør kortene klikkbare
>
     <div className="label-main">
      <h3>{employee.employee_name ||employee.name}</h3>
      <p>Ansattnr (Talkmore): {employee.employeeNr_Talkmore}</p>
      <p>Ansattnr (Telenor): {employee.employeeNr_Telenor}</p>
    </div>
        </div> 
        
        {/**Profilbilde*/}
        <div className='profile-img-container'>
            <img 
                src={profileImage} 
                alt="Profilbilde Ansatt"
                className='profile-img'
            />
        </div>

        {/**Ansatt/jobb informasjon*/}
        <p><span className='label-info'> Stilling: </span> {employee.workPosistion_title || "Ikke tildelt"}</p>
        <p><span className='label-info'> Team: </span> {employee.team_name || "Ikke tildelt"}</p>
        <p><span className='label-info'> Fast/Innleid: </span> {employee.form_of_employeement || "Ikke tildelt"}</p>
        <p><span className='label-info'> Stillingsprosent: </span> {employee.employee_percentages || "Ikke tildelt"} %</p>  
    


    </div>
    ))}
    </>
  );
}

export default ProfileCards;
