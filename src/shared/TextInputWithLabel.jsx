import styled from 'styled-components'

const StyledInput = styled.input`
    margin-left: 10px;
`

function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
    return (
        <>
            <label htmlFor={elementId}>{label}</label>
            <StyledInput type="text" id={elementId} ref={ref} value={value} onChange={onChange}></StyledInput>
        </>
    )
}

export default TextInputWithLabel