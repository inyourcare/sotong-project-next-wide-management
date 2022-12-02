import { Button, Pagination } from "@mui/material";
import { GridFooter, GridFooterContainer } from "@mui/x-data-grid";

export default function BasicAddRemoveDataGridFooter(
    { onAddClick, onRemoveClick }: { onAddClick: () => void, onRemoveClick: () => void }
) {
    return (<>
        <GridFooterContainer>
            <Button onClick={onAddClick}>추가</Button>
            <Button onClick={onRemoveClick}>삭제</Button>
            <GridFooter sx={{
                border: 'none', // To delete double border.
            }} />
            {/* <Pagination /> */}
        </GridFooterContainer>
    </>)
}