import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  searchContainer: {
    position: 'relative',
    margin: '20px auto',
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    border: '1px solid #ccc',
    borderTop: 'none',
    maxHeight: '300px',
    overflowY: 'auto',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  }
}));
