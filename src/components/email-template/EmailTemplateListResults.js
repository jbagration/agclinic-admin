import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const EmailTemplateListResults = ({ templates, onDelete, ...rest }) => (
    <Card {...rest}>
        <PerfectScrollbar>
            <Box sx={{ minWidth: 1050 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Id
                            </TableCell>
                            <TableCell>
                                Key
                            </TableCell>
                            <TableCell>
                                Subject
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {templates.map((template) => (
                            <TableRow hover key={template.id}>
                                <TableCell>
                                    {template.id }
                                </TableCell>
                                <TableCell>
                                    {template.key}
                                </TableCell>
                                <TableCell>
                                    {template.subject}
                                </TableCell>
                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <RouterLink to={`/app/email-templates/edit/${template.id}`}>
                                        <Button color="primary" variant="contained">
                                            Edit
                                        </Button>
                                    </RouterLink>
                                    <Button sx={{ ml: 1 }} color="primary" variant="contained" onClick={() => onDelete(template.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </PerfectScrollbar>
    </Card>
);

EmailTemplateListResults.propTypes = {
    templates: PropTypes.array.isRequired,
    onDelete: PropTypes.func
};

export default EmailTemplateListResults;
