import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Form, Icon, Button } from '../ui';
import './FileUpload.sass';

const propTypes = {

};

const defaultProps = {

};

const FileUpload = (props) => {
  const [file, setFile] = useState(null);
  const [rejectedFile, setRejectedFile] = useState(null);
  const [multipleDropped, setMultipleDropped] = useState(false);

  const handleDrop = ([accepted], rejected) => {
    if (accepted) {
      setFile(accepted);
      setRejectedFile(null);
      setMultipleDropped(false);
    }
    if (rejected.length === 1) {
      setFile(null);
      setRejectedFile(rejected[0]);
      setMultipleDropped(false);
    }
    if (rejected.length > 1) {
      setFile(null);
      setMultipleDropped(true);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setRejectedFile(null);
    setMultipleDropped(false);
  };

  return (
    <Form className="FileUpload">
      <Dropzone
        className="upload-dropzone"
        activeClassName="upload-dropzone-active"
        onDrop={handleDrop}
        accept=".png,.jpg,.jpeg"
        multiple={false}
      >
        <Icon name="file-upload" />
        <div className="d-and-d">
          DRAG
          {' & '}
          DROP
        </div>
        <div className="browse-for-file">or browse for file</div>
      </Dropzone>
      <Button type="submit">Upload</Button>
      <Button type="reset" onClick={handleCancel}>Cancel</Button>
      <div className="upload-info">
        {file && (
          <span>
            File
            {` "${file.name}" `}
            is ready for upload.
          </span>
        )}
        {rejectedFile && (
          <span>
            File
            {` "${rejectedFile.name}" `}
            cannot be uploaded.
          </span>
        )}
        {multipleDropped && (
          <span>
            Please only drop one file.
          </span>
        )}
      </div>
    </Form>
  );
};

FileUpload.propTypes = propTypes;
FileUpload.defaultProps = defaultProps;

export default FileUpload;
