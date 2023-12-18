// import { useCallback } from "react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// const useItemsTextFieldStateAndFunctionalities = () => {
//   const { itemInfo, isEditMode } = useSelector((state) => state.itemOrProduct);
//   const { itemName, itemCode, itemModel, itemDescription, itemPricePerUnit } =
//     itemInfo;
//   "iteminfoINfhook", itemInfo;
//   const [itemsTextFieldsInfo, setItemsTextFieldsInfo] = useState({
//     itemNameLocal: isEditMode ? itemName : "",
//     itemCodeLocal: isEditMode ? itemCode : "",
//     itemModelLocal: isEditMode ? itemModel : "",
//     itemDescriptionLocal: isEditMode ? itemDescription : "",
//     itemPricePerUnitLocal: isEditMode ? itemPricePerUnit : "",
//   });
//   "itemsTextFieldsInfo", itemsTextFieldsInfo;
//   const validateNumber = (number) => {
//     const valid = /^\d*\.?(?:\d{1,2})?$/;

//     if (!valid.test(number)) {
//       return "";
//     } else {
//       return number;
//     }
//   };

//   const handleInputChange = useCallback(
//     (e) => {
//       const { name, value } = e.target;
//       "valueLength", value.length;
//       setItemsTextFieldsInfo({
//         ...itemsTextFieldsInfo,
//         [name]:
//           name === "itemPricePerUnitLocal" ? validateNumber(value) : value,
//       });
//     },
//     [
//       itemsTextFieldsInfo.itemNameLocal,
//       itemsTextFieldsInfo.itemCodeLocal,
//       itemsTextFieldsInfo.itemModelLocal,
//       itemsTextFieldsInfo.itemDescriptionLocal,
//       itemsTextFieldsInfo.itemPricePerUnitLocal,
//     ]
//   );
//   const clearTextFieldState = useCallback(() => {
//     setItemsTextFieldsInfo({
//       itemNameLocal: "",
//       itemCodeLocal: "",
//       itemModelLocal: "",
//       itemDescriptionLocal: "",
//       itemPricePerUnitLocal: "",
//     });
//   }, []);

//   return {
//     ...itemsTextFieldsInfo,
//     handleInputChange,
//     clearTextFieldState,
//   };
// };
// export default useItemsTextFieldStateAndFunctionalities;
