import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

export const ToastEditor = () => (
    <Editor
        initialValue="hello react editor world!"
        previewStyle="vertical"
        // height="600px"
        initialEditType={"wysiwyg"}
        useCommandShortcut={true}
    />
);