import { Button } from "@mui/material";

export default function BasicAddRemoveDataGridFooter(
    { onAddClick, onRemoveClick }: { onAddClick: () => void, onRemoveClick: () => void }
) {
    return (<><Button onClick={onAddClick}>추가</Button><Button onClick={onRemoveClick}>삭제</Button></>)
}