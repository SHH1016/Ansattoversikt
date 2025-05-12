import React, { useState, useEffect } from "react";
import GreenButton from "../UI/GreenButton";
import RedButton from "../UI/RedButton";
import "../../styles/popup.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateChangeLog } from "../../redux/slices/AdminSlices/adminHistoryCrudSlice";

const EditHistoryPopup = ({
  history,
  type,
  teams,
  positions,
  onClose,
  onSave,
}) => {
  const [editData, setEditData] = useState({
    old_value: history?.old_value || "",
    new_value: history?.new_value || "",
    start_date: history?.start_date || "",
    end_date: history?.end_date || "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("EditHistoryPopup type:", type);
  }, [type]);

  useEffect(() => {
    if (history) {
      setEditData({
        old_value: history.old_value || "",
        new_value: history.new_value || "",
        start_date:
          history.start_date ||
          history?.old_value?.split("fra ")[1]?.split(" til ")[0] ||
          "",
        end_date:
          history.end_date || history?.old_value?.split("til ")[1] || "",
      });
    }
  }, [history]);

  const getTitle = () => {
    switch (type) {
      case "workPosistion_id":
      case "workPosistion_title":
        return "Rediger historikk for stillingstittel";
      case "employee_percentages":
        return "Rediger historikk for stillingsprosent";
      case "leave":
      case "leave_percentage":
        return "Rediger historikk for permisjon";
      case "employeeNr_Telenor":
      case "employeeNr_Talkmore":
        return "Rediger historikk for ansattnummer";
      case "team_id":
      case "team_name":
        return "Rediger historikk for team";
      case "start_date":
      case "end_date":
        return "Rediger historikk for dato";
      default:
        return "Rediger historikk";
    }
  };

  // Håndterer endring av inputverdier
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Sjekker om changeLog_id er gyldig
      if (!history.changeLog_id) {
        console.error("Feil: changeLog ID mangler.");
        return;
      }

      // Bygger oppdatert data basert på type
      const updatedData = {
        old_value: editData.old_value,
        new_value: editData.new_value,
      };

      // Legger til sluttdato hvis type er end_date
      if (type === "end_date") {
        updatedData.end_date = editData.end_date;
      }

      console.log("Sending ChangeLog ID:", history.changeLog_id);
      console.log("Updated Data:", updatedData);

      // Bruk Redux-thunk for å oppdatere historikk
      await dispatch(
        updateChangeLog({
          changeLogId: history.changeLog_id,
          updatedFields: updatedData,
        })
      );

      onSave(); // Oppdaterer historikken i parent
      onClose(); // Lukker popupen
    } catch (error) {
      console.error("Feil ved lagring av historikk", error);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">{getTitle()}</h2>

        {/* Dynamisk input basert på type */}
        {type === "workPosistion_id" || type === "workPosistion_title" ? (
          <>
            <label>Velg stilling</label>
            <select
              name="new_value"
              value={editData.new_value}
              onChange={handleChange}
            >
              <option value="">Velg stilling</option>
              {positions?.map((pos) => (
                <option key={pos.workPosistion_id} value={pos.posistion_title}>
                  {pos.posistion_title}
                </option>
              ))}
            </select>
          </>
        ) : type === "employee_percentages" ? (
          <>
            <label>Velg stillingsprosent</label>
            <select
              name="new_value"
              value={editData.new_value}
              onChange={handleChange}
            >
              <option value="">Velg prosent</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <option key={val} value={val}>
                  {val}%
                </option>
              ))}
            </select>
          </>
        ) : type === "leave" || type === "leave_percentage" ? (
          <>
            <label>Permisjonsprosent</label>
            <select
              name="new_value"
              value={editData.new_value}
              onChange={handleChange}
            >
              <option value="">Velg prosent</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <option key={val} value={val}>
                  {val}%
                </option>
              ))}
            </select>
            <label>Startdato</label>
            <input
              type="date"
              name="start_date"
              value={editData.start_date}
              onChange={handleChange}
            />
            <label>Sluttdato</label>
            <input
              type="date"
              name="end_date"
              value={editData.end_date}
              onChange={handleChange}
            />
          </>
        ) : type === "end_date" ? (
          <>
            <label>Sluttdato</label>
            <input
              type="date"
              name="end_date"
              value={editData.end_date}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <label>Opprinnelig Verdi</label>
            <input
              type="text"
              name="old_value"
              value={editData.old_value}
              readOnly
            />

            <label>Ny Verdi</label>
            <input
              type="text"
              name="new_value"
              value={editData.new_value}
              onChange={handleChange}
            />
          </>
        )}
        {/* knappene nederst */}
        <div className="popup-buttons">
          <GreenButton text="Lagre" onClick={handleSave} />
          <RedButton text="Avbryt" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default EditHistoryPopup;
