import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload as uploadFile } from '../../redux/fileUpload';
import { Form, Icon, Button, Input } from '../ui';
import './FileUpload.sass';

const propTypes = {
  upload: PropTypes.func.isRequired,
  fileUpload: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  }).isRequired,
};

const FileUpload = ({ upload, fileUpload }) => {
  const [file, setFile] = useState(null);
  const [rejectedFile, setRejectedFile] = useState(null);
  const [multipleDropped, setMultipleDropped] = useState(false);
  const [sequenceName, setSequenceName] = useState('');

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
    setSequenceName('');
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', file, sequenceName);
    upload({
      data: formData,
      mimeType: file.type,
      name: sequenceName,
    }).then(handleCancel);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSequenceName(value);
  };

  return (
    <Form className="FileUpload" onSubmit={handleSubmit}>
      <Input
        placeholder="please enter sequence name"
        onChange={handleChange}
        value={sequenceName}
      />
      <Dropzone
        className="upload-dropzone"
        activeClassName="upload-dropzone-active"
        onDrop={handleDrop}
        accept=".png,.jpg,.jpeg,.gif"
        multiple={false}
      >
        <Icon name="cloud-upload" />
        <div className="d-and-d">
          DRAG
          {' & '}
          DROP
        </div>
        <div className="browse-for-file">or browse for file</div>
      </Dropzone>
      <Button
        type="submit"
        disabled={!file || !sequenceName}
      >
        Upload
      </Button>
      <Button
        type="reset"
        onClick={handleCancel}
        disabled={!file && !rejectedFile && !sequenceName}
      >
        Cancel
      </Button>
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

const mapStateToProps = ({ fileUpload }) => ({
  fileUpload,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  upload: uploadFile,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);
