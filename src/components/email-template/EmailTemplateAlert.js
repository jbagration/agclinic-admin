import PropTypes from 'prop-types';
import {
  Box,
  Alert
} from '@material-ui/core';

const EmailTemplateAlert = ({ status, message, onClose }) => {
  if (!status) {
    return <></>;
  }

  return (
    <Box>
      <Alert onClose={onClose} severity={status}>{message}</Alert>
    </Box>
  );
}

EmailTemplateAlert.propTypes = {
  status: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func
};

EmailTemplateAlert.defaultProps = {
  status: '',
  message: '',
  onClose: () => {}
};

export default EmailTemplateAlert;
