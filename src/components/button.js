const Button = ({ text, onClick }) => {
    const classes = 'btn btn-primary';

    return (
        <button onClick={onClick} className={classes}>
            {text}
        </button>
    );
};

export default Button;
