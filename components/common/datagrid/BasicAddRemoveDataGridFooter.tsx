import { Button, Grid, Pagination } from "@mui/material";
import { GridFooter, GridFooterContainer } from "@mui/x-data-grid";

export default function BasicAddRemoveDataGridFooter(
    { onAddClick, onRemoveClick }: { onAddClick: () => void, onRemoveClick: () => void }
) {
    return (<>
        <GridFooterContainer>
            <Grid container>
                <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Button onClick={onAddClick}>추가</Button>
                    <Button onClick={onRemoveClick}>삭제</Button>
                </Grid>
                {/* <Grid item xs={6} sx={{minWidth: '400px'}}> */}
                    <GridFooter sx={{
                        border: 'none', // To delete double border.
                    }} />
                {/* </Grid> */}
            </Grid>


            {/* <Pagination /> */}
        </GridFooterContainer>
    </>)
}