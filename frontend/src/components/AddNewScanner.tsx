import type {ScannerModel} from "./model/ScannerModel.ts";

type AddNewScannerProps = {
    language: string;
    handleNewScannerSubmit: (newScanner: ScannerModel) => void;
}

export default function AddNewScanner(props: Readonly<AddNewScannerProps>) {




    return (
        <div>
            <h2>Add New Scanner Component - To be implemented</h2>
        </div>
    )
}