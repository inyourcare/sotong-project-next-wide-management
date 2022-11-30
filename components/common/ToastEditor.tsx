import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export const ToastEditor = ({height}:{height:string}) => (
    <Editor
        initialValue="hello react editor world!"
        previewStyle="vertical"
        // height="600px"
        height={height}
        initialEditType={"wysiwyg"}
        useCommandShortcut={true}
    />
);