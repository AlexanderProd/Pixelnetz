import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { upload as uploadSound } from '../../redux/soundUpload';
import { Form, Icon, Button, Input } from '../ui';
import './SoundUpload.sass';

const propTypes = {
  upload: PropTypes.func.isRequired,
  soundUpload: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  }).isRequired,
};

const SoundUpload = ({ upload }) => {
  const [file, setFile] = useState(null);
  const [rejectedFile, setRejectedFile] = useState(null);
  const [multipleDropped, setMultipleDropped] = useState(false);
  const [soundName, setSoundName] = useState('');

  const handleDrop = ([accepted], rejected) => {
    if (accepted) {
      setFile(accepted);
      setRejectedFile(null);
      setMultipleDropped(false);
      if (!soundName) {
        const nameParts = accepted.name.split('.');
        nameParts.pop();
        const name = nameParts.join('_');
        setSoundName(name);
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
    setSoundName('');
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('file', file, soundName);
    upload({
      data: formData,
      mimeType: file.type,
      name: soundName,
    }).then(handleCancel);
  };

  const handleNameChange = e => {
    const { value } = e.target;
    setSoundName(value);
  };

  return (
    <Form className="SoundUpload" onSubmit={handleSubmit}>
      <Input
        placeholder="please enter sound name"
        onChange={handleNameChange}
        value={soundName}
      />
      <Dropzone
        className="upload-dropzone"
        activeClassName="upload-dropzone-active"
        onDrop={handleDrop}
        accept=".wav,.mp3,.ogg"
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
      <Button type="submit" disabled={!file || !soundName}>
        Upload
      </Button>
      <Button
        type="reset"
        onClick={handleCancel}
        disabled={!file && !rejectedFile && !soundName}
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

SoundUpload.propTypes = propTypes;

const mapStateToProps = ({ soundUpload }) => ({
  soundUpload,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      upload: uploadSound,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundUpload);
