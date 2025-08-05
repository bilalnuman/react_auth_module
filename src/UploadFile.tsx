import { useState } from 'react';
import FileUploader from './features/fileUploader'

const UploadFile = () => {
    const [oldUrls, setOldUrls] = useState<string[]>(['https://watchlytics.s3.eu-west-2.amazonaws.com/static/profile_pictures/39b2f8c5c03f999c95a61c4766889298.jpg']);

    return (
        <div style={{ padding: '2rem' }} className='max-w-[400px] h-[400px]'>
            <h1>Advanced File Uploader</h1>
            <FileUploader
                multiple
                allowedTypes={['image/png', 'image/jpeg', 'application/pdf', 'video/mp4', 'video/webm']}
                maxFileSizeMB={5}
                maxDimensions={{ width: 1920, height: 1080 }}
                // showProgress
                // fileMeta={{ size: true,type:true,name:true }}
                showPreview
                dbFileUrls={oldUrls}
                onDbFilesChange={setOldUrls}
                onFilesChange={files => console.log(files)}
            />

        </div>
    );
}

export default UploadFile