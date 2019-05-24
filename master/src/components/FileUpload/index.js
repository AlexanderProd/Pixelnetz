import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload as uploadFile } from '../../redux/fileUpload';
import { Form, Icon, Button, Input } from '../ui';
import { DEFAULT_BIT_DEPTH } from '../../../../shared/dist/util/colors';
import './FileUpload.sass';

const propTypes = {
  upload: PropTypes.func.isRequired,
  fileUpload: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  }).isRequired,
};

const FileUpload = ({ upload }) => {
  const [file, setFile] = useState(null);
  const [rejectedFile, setRejectedFile] = useState(null);
  const [multipleDropped, setMultipleDropped] = useState(false);
  const [sequenceName, setSequenceName] = useState('');
  const [bitDepth, setBitDepth] = useState('');

  const handleDrop = ([accepted], rejected) => {
    if (accepted) {
      setFile(accepted);
      setRejectedFile(null);
      setMultipleDropped(false);
      if (!sequenceName) {
        const nameParts = accepted.name.split('.');
        nameParts.pop();
        const name = nameParts.join('_');
        setSequenceName(name);
      }
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
    setBitDepth('');
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', file, sequenceName);
    upload({
      data: formData,
      mimeType: file.type,
      name: sequenceName,
      bitDepth: bitDepth || DEFAULT_BIT_DEPTH,
    }).then(handleCancel);
  };

  const handleNameChange = e => {
    const { value } = e.target;
    setSequenceName(value);
  };

  const handleBitDepthChange = e => {
    const { value } = e.target;
    setBitDepth(value);
  };

  return (
    <Form className="FileUpload" onSubmit={handleSubmit}>
      <Input
        placeholder="please enter sequence name"
        onChange={handleNameChange}
        value={sequenceName}
      />
      <Input
        placeholder={`Bit depth (default ${DEFAULT_BIT_DEPTH})`}
        type="number"
        min="1"
        max="8"
        onChange={handleBitDepthChange}
        value={bitDepth}
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
      <Button type="submit" disabled={!file || !sequenceName}>
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
        {multipleDropped && <span>Please only drop one file.</span>}
      </div>
    </Form>
  );
};

FileUpload.propTypes = propTypes;

const mapStateToProps = ({ fileUpload }) => ({
  fileUpload,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      upload: uploadFile,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileUpload);
