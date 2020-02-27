import electron from 'electron';
import React from 'react';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as DfuActions from '../actions/dfuActions';

const SelectFile = props => {
    const { setDfuFilePath, filePath } = props;

    const onFileSelected = $filePath => {
        setDfuFilePath($filePath);
        // loadDfuPackageInfo($filePath);
    };

    const showFileDialog = () => {
        const { dialog } = electron.remote;
        const filters = [{
            name: 'Zip Files',
            extensions: ['zip'],
        }];

        dialog.showOpenDialog({
            title: 'Choose file', filters, properties: ['openFile'],
        }, filePaths => {
            if (!filePaths) {
                return;
            }
            const [filePath2] = filePaths;
            if (!filePath2) {
                return;
            }
            onFileSelected(filePath2);
        });
    };

    const onClicked = () => {
        showFileDialog();
    };

    return (
        <div style={{ margin: '15px' }}>
            <h4>
                Select File
            </h4>
            <Button onClick={onClicked}>
                DFU FILE
            </Button>
            <div style={{ marginTop: '10px', marginRight: '10px' }}>
                {filePath}
            </div>
        </div>
    );
};

SelectFile.propTypes = {
    setDfuFilePath: PropTypes.func.isRequired,
    filePath: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
    const { dfu, adapter } = state.app;

    const { selectedAdapter } = adapter;

    return {
        adapter: selectedAdapter,
        isVisible: dfu.isDfuDialogVisible,
        isConfirmCloseVisible: dfu.isConfirmCloseVisible,
        device: dfu.device,
        filePath: dfu.filePath,
        packageInfo: dfu.packageInfo,
        isStarted: dfu.isStarted,
        isStopping: dfu.isStopping,
        isCompleted: dfu.isCompleted,
        percentCompleted: dfu.percentCompleted,
        status: dfu.status,
        fileNameBeingTransferred: dfu.fileNameBeingTransferred,
        throughput: dfu.throughput,
    };
}

function mapDispatchToProps(dispatch) {
    return Object.assign({},
        bindActionCreators(DfuActions, dispatch));
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectFile);
